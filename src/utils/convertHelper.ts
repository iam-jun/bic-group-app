export class ConvertHelperOptions {
  public separator?: string;
  public split?: RegExp;
  public process?: (arg) => any;
  public exclude?: string[];
}
export class ConvertHelper {
  /**
   * Check input is function
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isFunction(obj: unknown): boolean {
    return typeof obj === 'function';
  }

  /**
   * Check input is numeric
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isNumerical(obj: unknown): boolean {
    return !isNaN(<number>obj) && !isNaN(parseFloat(<string>obj));
  }

  /**
   * Check input is object
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isObject(obj: unknown): boolean {
    return obj === Object(obj);
  }

  /**
   * Check input is array
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isArray(obj: unknown): boolean {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  /**
   * Check input is date
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isDate(obj: unknown): boolean {
    return Object.prototype.toString.call(obj) == '[object Date]';
  }

  /**
   * Check input is regexp
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isRegExp(obj: unknown): boolean {
    return Object.prototype.toString.call(obj) == '[object RegExp]';
  }

  /**
   * Check input is boolean
   * @private
   * @param obj Unknown
   * @returns Boolean
   */
  private static _isBoolean(obj: unknown): boolean {
    return Object.prototype.toString.call(obj) == '[object Boolean]';
  }

  /**
   * High order function _processor
   * @private
   * @param convert Function - Default camelize and decamelize
   * @param options ConvertHelperOptions
   * @returns  default convert function or using custom convert function.
   */
  private static _processor(convert, options): any {
    const callback =
      options && 'process' in options ? options.process : options;

    if (typeof callback !== 'function') {
      return convert;
    }
    return (string: string, options) => {
      return callback(string, convert, options);
    };
  }

  /**
   * Main recursive conversion
   * @private
   * @param convert  Function - Default camelize and decamelize
   * @param obj Any
   * @param options ConvertHelperOptions
   */
  private static _processKeys(
    convert: (...arg) => string,
    obj: any,
    options?: ConvertHelperOptions,
  ): any {
    if (
      !ConvertHelper._isObject(obj) ||
      ConvertHelper._isDate(obj) ||
      ConvertHelper._isRegExp(obj) ||
      ConvertHelper._isBoolean(obj) ||
      ConvertHelper._isFunction(obj)
    ) {
      return obj;
    }

    let output;

    if (ConvertHelper._isArray(obj)) {
      output = [];
      for (let i = 0; i < obj.length; i++) {
        output.push(ConvertHelper._processKeys(convert, obj[i], options));
      }
    } else {
      output = {};
      for (const key in obj) {
        if (Array.prototype.includes.call(options?.exclude ?? [], key)) {
          output[convert(key, options)] = obj[key];
        } else {
          output[convert(key, options)] = ConvertHelper._processKeys(
            convert,
            obj[key],
            options,
          );
        }
      }
    }
    return output;
  }

  /**
   * Separate Words
   * @protected
   * @param string String
   * @param options ConvertHelperOptions
   */
  protected static separateWords(
    string: string,
    options?: ConvertHelperOptions,
  ): string {
    options = options || {};
    const separator = options.separator || '_';
    const split = options.split || /(?=[A-Z])/;

    return string.split(split).join(separator);
  }

  /**
   * Camel to snake case
   * @param string String
   * @param options ConvertHelperOptions
   * @returns String
   */
  protected static decamelize = (
    string: string,
    options?: ConvertHelperOptions,
  ): string => {
    return ConvertHelper.separateWords(string, options).toLowerCase();
  };

  /**
   * Snake case to camel
   * @param string String
   * @returns String
   */
  protected static camelize = (string: string): string => {
    if (ConvertHelper._isNumerical(string)) {
      return string;
    }
    string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    return string.substring(0, 1).toLowerCase() + string.substring(1);
  };

  /**
   *  Main start recursive convert camelize keys
   * @param object Unknown
   * @param options ConvertHelperOptions
   * @returns T
   */
  public static camelizeKeys<T>(
    object: unknown,
    options?: ConvertHelperOptions,
  ): T {
    return this._processKeys(
      ConvertHelper._processor(ConvertHelper.camelize, options),
      object,
      options,
    );
  }

  /**
   *  Main start recursive convert decamelize keys
   * @param object Unknown
   * @param options ConvertHelperOptions
   * @returns JSON
   */
  public static decamelizeKeys(
    object: unknown,
    options?: ConvertHelperOptions,
  ): Record<string, any> {
    return ConvertHelper._processKeys(
      ConvertHelper._processor(ConvertHelper.decamelize, options),
      object,
      options,
    );
  }
}
