export interface IGeneralRepository {
  create(data: any): Promise<any>;
  delete(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  findAll(): Promise<any>;
  findById(id: string): Promise<any>;
}
