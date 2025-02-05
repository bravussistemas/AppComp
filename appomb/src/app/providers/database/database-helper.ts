import { map } from 'rxjs/operators';

export class DatabaseHelper {

  constructor() {
  }

  static parseFieldsToQuery(fields) {
    let _fields = [];

    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      _fields.push(field + ' = ?');
    }
    return _fields.join(' AND ');
  }

  static getFieldsFromSchema(schema: string): string[] {
    let lines = schema.split(',');
    let fields = ['id'];
    for (let i in lines) {
      let line = lines[i];
      fields.push(line.split(' ')[0]);
    }
    console.debug('getFieldsFromSchema: ', fields);
    return fields;
  }
}
