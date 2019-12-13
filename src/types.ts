export interface IList {
  readonly id: number;
  name: string;
  cards: ICard[];
}

export interface ICard {
  readonly id: number;
  text: string;
}
