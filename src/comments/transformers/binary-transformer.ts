// import { ValueTransformer } from 'typeorm';

// export class BinaryTransformer implements ValueTransformer {
//   to(value: Buffer): any {
//     return value;
//   }

//   from(value: any): Buffer {
//     if (value instanceof Buffer) {
//       return value;
//     } else if (value instanceof Uint8Array) {
//       return Buffer.from(value);
//     } else {
//       throw new Error('Invalid data type');
//     }
//   }
// }
