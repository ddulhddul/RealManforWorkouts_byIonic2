export class workoutForm {
  constructor(
    public id: string,
    public name: string,
    public units: Array<number>,
    public goal: number,
    public img: string,
    public weight?: number,
    public weightUnit?: string,
    public lastGoal?: number,
    public lastWeight?: string
  ) {  }
}