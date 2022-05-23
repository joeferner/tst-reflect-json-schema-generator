export class MyObject {
    // Static properties must be ignored
    public static staticProp: number = 0;

    public propA: number = 0;
    public propB: number = 0;

    public noType: any;

    // Protected properties must be ignored
    protected protectedProp: string = '';

    // Protected properties must be ignored
    private privateProp: boolean = false;

    readonly readonlyProp: string = '';

    // Constructors must be ignored
    public constructor(protected a: number, private b: number, c: number, public propC: number,
        public propD?: string) {
        this.privateProp = false;
    }

    // Normal method must be ignored
    public getPrivateProp() {
        return this.privateProp;
    }

    // Getter methods must be ignored
    public get getterSetter(): number {
        return this.propA;
    }

    // Setter methods must be ignored
    public set getterSetter(value: number) {
        this.propA = value;
    }
}
