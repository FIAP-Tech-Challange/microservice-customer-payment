import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';

describe('TotemModel', () => {
  describe('create', () => {
    it('should create a totem with valid properties', () => {
      const validProps = {
        name: 'Totem Name',
      };

      const totem = TotemModel.create(validProps);

      expect(totem).toBeInstanceOf(TotemModel);
      expect(totem.id).toBeDefined();
      expect(totem.name).toBe(validProps.name);
      expect(totem.tokenAccess).toBeDefined();
      expect(totem.isActive).toBe(true);
      expect(totem.createdAt).toBeDefined();
    });

    it('should throw error if missing name', () => {
      expect(() => TotemModel.create({ name: '' })).toThrow('Name is required');
    });
  });

  describe('restore', () => {
    it('should restore a totem from properties', () => {
      const date = new Date();
      const props = {
        id: 'test-id',
        name: 'Totem Name',
        tokenAccess: 'test-token',
        isActive: true,
        createdAt: date,
      };

      const totem = TotemModel.restore(props);

      expect(totem).toBeInstanceOf(TotemModel);
      expect(totem.id).toBe(props.id);
      expect(totem.name).toBe(props.name);
      expect(totem.tokenAccess).toBe(props.tokenAccess);
      expect(totem.isActive).toBe(props.isActive);
      expect(totem.createdAt).toBe(props.createdAt);
    });

    it('should throw error if missing required properties', () => {
      const invalidProps = {
        id: 'test-id',
        name: '',
        tokenAccess: 'test-token',
        isActive: true,
        createdAt: new Date(),
      };

      expect(() => TotemModel.restore(invalidProps)).toThrow(
        'Name is required',
      );
    });
  });

  describe('activate/inactivate', () => {
    it('should activate a totem', () => {
      const totem = TotemModel.create({ name: 'Totem Name' });
      totem.inactivate();
      expect(totem.isActive).toBe(false);

      totem.activate();

      expect(totem.isActive).toBe(true);
    });

    it('should inactivate a totem', () => {
      const totem = TotemModel.create({ name: 'Totem Name' });

      totem.inactivate();

      expect(totem.isActive).toBe(false);
    });
  });
});
