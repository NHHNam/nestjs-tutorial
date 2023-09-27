export interface IBaseService {
  findAll(): Promise<any>;
  findOne(id: any): Promise<any>;
  create(data: any): Promise<any>;
  update(id: any, data: any): Promise<any>;
  delete(id: any): Promise<any>;
}
