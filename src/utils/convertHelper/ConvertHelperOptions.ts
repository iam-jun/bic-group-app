export default class ConvertHelperOptions {
  public separator?: string;

  public split?: RegExp;

  public process?: (arg: any) => any;

  public exclude?: string[];
}
