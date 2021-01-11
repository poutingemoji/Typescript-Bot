class Util {
  /** 
    Utilizing https://stackoverflow.com/a/45332959 to have multiple class inheritance
  */
  aggregation(baseClass, ...mixins) {
    class base extends baseClass {
      constructor(...args) {
        super(...args);
        mixins.forEach((mixin) => {
          copyProps(this, new mixin(...args));
        });
      }
    }

    //This function copies all properties and symbols, filtering out some special ones.
    let copyProps = (targeted, source) => {
      Object.getOwnPropertyNames(source)
        .concat(Object.getOwnPropertySymbols(source))
        .forEach((prop) => {
          if (
            !prop.match(
              /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
            )
          )
            Object.defineProperty(
              targeted,
              prop,
              Object.getOwnPropertyDescriptor(source, prop)
            );
        });
    };

    //Outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    mixins.forEach((mixin) => {
      copyProps(base.prototype, mixin.prototype);
      copyProps(base, mixin);
    });
    return base;
  }
}

module.exports = new Util();
