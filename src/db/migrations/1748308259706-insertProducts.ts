import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertProducts1748306724937 implements MigrationInterface {
  name? = 'InsertProducts1748306724937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const CATEGORY_UUIDS = {
      lanche: crypto.randomUUID(),
      acompanhamento: crypto.randomUUID(),
      bebida: crypto.randomUUID(),
      sobremesa: crypto.randomUUID(),
    };
    const storeId = crypto.randomUUID();

    const lanches = [
      'X-Burguer',
      'X-Salada',
      'X-Bacon',
      'X-Egg',
      'X-Tudo',
      'Cheeseburguer',
      'Hambúrguer artesanal',
      'Smash Burger',
      'Veggie Burguer',
      'Frango grelhado',
      'Crispy Chicken',
      'Wrap de Frango',
      'Wrap Vegano',
      'Hot Dog Tradicional',
      'Hot Dog Duplo',
    ];

    const acompanhamentos = [
      'Batata frita',
      'Batata rústica',
      'Onion rings',
      'Polenta frita',
      'Salada verde',
      'Farofa temperada',
      'Vinagrete',
      'Arroz branco',
      'Feijão tropeiro',
      'Purê de batata',
    ];

    const bebidas = [
      'Coca-Cola lata',
      'Guaraná Antarctica lata',
      'Sprite lata',
      'Fanta Laranja lata',
      'Água sem gás',
      'Água com gás',
      'Suco de laranja natural',
      'Suco de maracujá',
      'Suco de limão',
      'Chá gelado pêssego',
      'Chá gelado limão',
      'Energético',
      'Milkshake de chocolate',
      'Milkshake de morango',
      'Refrigerante zero',
    ];

    const sobremesas = [
      'Brownie com sorvete',
      'Petit gâteau',
      'Torta de limão',
      'Pudim de leite condensado',
      'Mousse de maracujá',
      'Sorvete de creme',
      'Sorvete de chocolate',
      'Brigadeiro gourmet',
      'Cheesecake de frutas vermelhas',
      'Banoffe',
    ];

    function gerarDescricao(nome: string, categoria: string): string {
      switch (categoria) {
        case 'lanche':
          return `Delicioso ${nome} com ingredientes frescos, ideal para matar a fome com muito sabor.`;
        case 'acompanhamento':
          return `${nome} crocante e saboroso, perfeito para acompanhar o seu prato principal.`;
        case 'bebida':
          return `${nome} gelado para refrescar o seu dia e harmonizar com seu pedido.`;
        case 'sobremesa':
          return `${nome} doce e irresistível, feito para fechar sua refeição com chave de ouro.`;
        default:
          return `Produto ${nome}.`;
      }
    }

    const products: string[] = [];

    for (let i = 1; i <= 50; i++) {
      let category_id: string;
      let name: string;
      let price: number;
      let prep_time: number;
      let categoria_label: string;

      if (i <= 15) {
        category_id = CATEGORY_UUIDS.lanche;
        name = lanches[i - 1];
        price = 18 + (i % 5);
        prep_time = 10 + (i % 5);
        categoria_label = 'lanche';
      } else if (i <= 25) {
        category_id = CATEGORY_UUIDS.acompanhamento;
        name = acompanhamentos[i - 16];
        price = 6 + (i % 4);
        prep_time = 5 + (i % 3);
        categoria_label = 'acompanhamento';
      } else if (i <= 40) {
        category_id = CATEGORY_UUIDS.bebida;
        name = bebidas[i - 26];
        price = 4 + (i % 3);
        prep_time = 1;
        categoria_label = 'bebida';
      } else {
        category_id = CATEGORY_UUIDS.sobremesa;
        name = sobremesas[i - 41];
        price = 8 + (i % 2);
        prep_time = 4;
        categoria_label = 'sobremesa';
      }

      const id = crypto.randomUUID();
      const status = 'A';
      const description = gerarDescricao(name, categoria_label).replace(
        /'/g,
        "''",
      );
      const image_url = `https://example.com/image${i}.jpg`;
      const created_at = new Date().toISOString();
      const updated_at = created_at;

      products.push(`(
        '${id}', '${name.replace(/'/g, "''")}', ${price}, '${status}', '${description}',
        ${prep_time}, '${image_url}',
        '${category_id}', '${storeId}',
        '${created_at}', '${updated_at}'
      )`);
    }

    const query = `
      INSERT INTO products (
        id, name, price, status, description, prep_time, image_url, 
        category_id, store_id, created_at, updated_at
      ) VALUES ${products.join(', ')};
    `;

    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM products`);
  }
}
