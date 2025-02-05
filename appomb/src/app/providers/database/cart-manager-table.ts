import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CartManagerMemory } from './cart-manager-memory';

@Injectable()
export class CartManagerTable extends CartManagerMemory {
}
