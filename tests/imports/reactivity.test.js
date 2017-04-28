/* global describe it */
import reactiveObject from 'meteor-reactive-object';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { chai } from 'meteor/practicalmeteor:chai';

if (Meteor.isClient) {
  describe('Tests', () => {
    it('should be reactive', () => {
      const reactive = reactiveObject();

      let runs = 0;
      Tracker.autorun(() => {
        runs += 1;
        const value = reactive.foo; // eslint-disable-line
      });

      chai.assert.equal(typeof reactive.foo, 'undefined');
      chai.assert.equal(runs, 1);

      reactive.foo = 'bar';
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo, 'bar');
      chai.assert.equal(runs, 2);

      reactive.foo = 'bar';
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo, 'bar');
      chai.assert.equal(runs, 2);

      delete reactive.foo;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(typeof reactive.foo, 'undefined');
      chai.assert.equal(runs, 3);
    });

    it('should be reactive with initial value', () => {
      const reactive = reactiveObject({ foo: 'bar' });

      let runs = 0;
      Tracker.autorun(() => {
        runs += 1;
        const value = reactive.foo; // eslint-disable-line
      });

      chai.assert.equal(reactive.foo, 'bar');
      chai.assert.equal(runs, 1);

      reactive.foo = 'bar';
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo, 'bar');
      chai.assert.equal(runs, 1);

      delete reactive.foo;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(typeof reactive.foo, 'undefined');
      chai.assert.equal(runs, 2);
    });

    it('should have reactive sub objects', () => {
      const reactive = reactiveObject();

      let runs = 0;
      Tracker.autorun(() => {
        runs += 1;
        const value = reactive.foo && reactive.foo.bar; // eslint-disable-line
      });

      chai.assert.equal(typeof reactive.foo, 'undefined');
      chai.assert.equal(runs, 1);

      reactive.foo = { bar: 0 };
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo.bar, 0);
      chai.assert.equal(runs, 2);

      reactive.foo.bar = 1;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo.bar, 1);
      chai.assert.equal(runs, 3);

      reactive.foo.bar = 1;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo.bar, 1);
      chai.assert.equal(runs, 3);

      delete reactive.foo;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(typeof reactive.foo, 'undefined');
      chai.assert.equal(runs, 4);
    });

    it('should be reactive if sub object changes', () => {
      const reactive = reactiveObject();

      let runs = 0;
      Tracker.autorun(() => {
        runs += 1;
        const value = reactive.foo; // eslint-disable-line
      });

      chai.assert.equal(typeof reactive.foo, 'undefined');
      chai.assert.equal(runs, 1);

      reactive.foo = { bar: 0 };
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo.bar, 0);
      chai.assert.equal(runs, 2);

      reactive.foo.bar = 1;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo.bar, 1);
      chai.assert.equal(runs, 3);

      reactive.foo.bar = 1;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.foo.bar, 1);
      chai.assert.equal(runs, 3);

      delete reactive.foo.bar;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(typeof reactive.foo.bar, 'undefined');
      chai.assert.equal(runs, 4);
    });

    it('should be reactive with class instance as sub object', () => {
      const reactive = reactiveObject();
      class DummyClass {
        constructor(initial) {
          this.num = initial;
        }
      }
      const inst = new DummyClass(1);

      chai.assert.equal(typeof reactive.instance, 'undefined');
      reactive.instance = inst;

      let runs = 0;
      Tracker.autorun(() => {
        runs += 1;
        const value = reactive.instance && reactive.instance.num; // eslint-disable-line
      });

      chai.assert.equal(runs, 1);
      chai.assert.equal(reactive.instance.num, 1);

      reactive.instance.num = 2;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.instance.num, 2);
      chai.assert.equal(runs, 2);

      delete reactive.instance;
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(typeof reactive.instance, 'undefined');
      chai.assert.equal(runs, 3);
    });

    it('should be able to iterate over an array', () => {
      const reactive = reactiveObject();
      reactive.arr = [1, 2, 3];
      let runs = 0;
      Tracker.autorun(() => {
        runs += 1;
        reactive.result = reactive.arr.map(num => num * 2);
      });

      chai.assert.equal(runs, 1);
      chai.assert.equal(reactive.result.length, 3);

      reactive.arr.push(4);
      Tracker.flush({ _throwFirstError: true });
      chai.assert.equal(reactive.result.length, 4);
      chai.assert.equal(runs, 2);
    });
  });
}
