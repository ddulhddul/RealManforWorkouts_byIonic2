export class workoutForm {
  constructor(
    public id: string = '',
    public name: string = '',
    public units: Array<number> = [],
    public goal: number = 0,
    public img: string = '',
    public weight?: number,
    public weightUnit?: string,
    public lastGoal?: number,
    public lastWeight?: string,
    public unit1?: number,
    public unit2?: number,
    public unit3?: number,
  ) {  }
}