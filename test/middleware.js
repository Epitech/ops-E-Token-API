'use strict';

export default (chai, utils) => {
  const Assertion = chai.Assertion;
  function withFlagCheck(callback) {
    return function (_super) {
      return function (...args) {
        const route = utils.flag(this, 'fetchMock');

        if (route) {
          callback.call(this, route, ...args);
        } else {
          _super.call(this, ...args);
        }
      };
    };
  }


  Assertion.addMethod('route', function (str) {
    new Assertion(this._obj, `Expected ${this._obj} to be a fetch-mock object`).include.any.keys(['fetchMock', 'realFetch']);

    const routes = this._obj.routes.map(r => r.name);
    new Assertion(str, `Expected ${str} to be a fetch-mock route`).oneOf(routes);

    utils.flag(this, 'fetchMock', str);
  });

  Assertion.overwriteProperty('called', withFlagCheck(function (route) {
    this.assert(
      this._obj.called(route) === true,
      `Expected route "${route}" to have been called`,
      `Expected route "${route}" to not have been called`
    );
  }));

  Assertion.overwriteMethod('args', withFlagCheck(function (route, args) {
    const lastArgs = this._obj.lastCall(route);

    new Assertion(lastArgs).eql(args);
  }));

  Assertion.overwriteMethod('url', withFlagCheck(function (route, url) {
    const lastUrl = this._obj.lastUrl(route);

    this.assert(
      lastUrl === url,
      `Expected route "${route}" to have been called with URL ${url}`,
      `Expected route "${route}" to not have been called with URL ${url}`,
      url,
      lastUrl
    );
  }));

  Assertion.overwriteMethod('options', withFlagCheck(function (route, opts) {
    const lastOpts = this._obj.lastOptions(route);

    new Assertion(lastOpts).eql(opts);
  }));
};
