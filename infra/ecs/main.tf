terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = "us-east-1"
}


data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ecr_repository" "app_repo" {
  name = var.repository_ecr_name
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

resource "aws_security_group" "lb_sg" {
  name        = "shared-alb-sg"
  description = "Permite acesso HTTP na porta 80"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "shared" {
  name               = "microservice-customer-payment"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = data.aws_subnets.default.ids

  enable_deletion_protection = false
}

resource "aws_ssm_parameter" "lb_url" {
  name  = "/microservice/customer-payment/lb_url"
  type  = "String"
  value = aws_lb.shared.dns_name

  tags = {
    environment = "prod"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.shared.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "404: Rota não encontrada no ALB Compartilhado"
      status_code  = "404"
    }
  }
}

resource "random_password" "generated_api_key" {
  length           = 32
  special          = true
  override_special = "!@#$%"
}

resource "aws_secretsmanager_secret" "api_key" {
  name        = "microservice/customer-payment/api_key"
  description = "Api Key internal communication"
}

resource "aws_secretsmanager_secret_version" "api_key_value" {
  secret_id     = aws_secretsmanager_secret.api_key.id
  secret_string = random_password.generated_api_key.result
}

resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-sg"
  description = "Permite acesso na porta 3000 vindo APENAS do ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.lb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "app_tg" {
  name        = "${var.project_name}-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default.id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_listener_rule" "redirect_to_docs" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type = "redirect"
    redirect {
      path        = "/docs"
      status_code = "HTTP_301"
    }
  }

  condition {
    path_pattern {
      values = ["/"]
    }
  }
}

resource "aws_lb_listener_rule" "app_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "${var.project_name}-app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "${var.project_name}-app"
    image     = "${data.aws_ecr_repository.app_repo.repository_url}:${var.image_tag}"
    essential = true

    environment = [
      {
        name  = "DB_PG_HOST"
        value = "${var.db_pg_host}"
      },
      {
        name  = "DB_PG_PORT"
        value = "${var.db_pg_port}"
      },
      {
        name      = "DB_PG_USER"
        value     = "${var.db_pg_username}",
        sensitive = true
      },
      {
        name      = "DB_PG_PASSWORD"
        value     = "${var.db_pg_password}"
        sensitive = true
      },
      {
        name  = "DB_PG_NAME"
        value = "${var.db_pg_name}"
      },
      {
        name  = "API_KEY_SECRET_NAME"
        value = "${aws_secretsmanager_secret.api_key.name}"
      },
      {
        name  = "API_KEY_NAME_ORDER"
        value = "${var.api_key_name_order}"
      },
      {
        name  = "ORDER_SERVICE_BASE_URL_PARAM"
        value = "${var.order_service_base_url_param}"
      },
      {
        name  = "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
        value = "${var.jwt_access_token_expiration_time}"
      },
      {
        name  = "JWT_SECRET_NAME"
        value = "${var.jwt_secret_name}"
      },
      {
        name  = "NODE_ENV"
        value = "production"
      },
      {
        name  = "EXTERNAL_PAYMENT_CONSUMER_KEY"
        value = "${var.external_payment_consumer_key}"
      }
    ]

    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.project_name}-app"
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "/ecs/${var.project_name}-app"
}

resource "aws_ecs_service" "app_service" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.app_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "${var.project_name}-app"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener_rule.app_rule]
}
