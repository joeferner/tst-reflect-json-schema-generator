export class Base {
    public a: number = 0;
    public b: string | string = '';
}

export class MyObject extends Base {
    public c: boolean = false;
    public override b: string = '';
}
