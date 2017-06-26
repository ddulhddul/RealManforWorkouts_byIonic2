export class workoutForm {
  constructor(
    public id: string = '',
    public name: string = '',
    public units: Array<number> = [],
    public goal: number = 0,
    public img: string = 'icon',
    public unit1: number = 5,
    public unit2: number = 10,
    public unit3: number = 15,
    public weight?: number,
    public weightUnit?: string,
    public done?: number,
    public lastGoal?: number,
    public lastWeight?: string,
    public cumTime?: number
  ) {  }
}