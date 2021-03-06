/* eslint-env mocha */

import {assert} from 'chai';
import autoprefixer from './autoprefixer';

describe('./utils/autoprefixer', () => {
  const MSIE9_USER_AGENT = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 7.1; Trident/5.0)';
  const MSIE10_USER_AGENT = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';

  describe('server side', () => {
    let savedWindow;
    let skip = false;

    beforeEach(() => {
      savedWindow = global.window;

      try {
        // We can reasign window when the test is runned in a real browser.
        global.window = undefined;
        skip = false;
      } catch (err) {
        skip = true;
      }
    });

    afterEach(() => {
      if (!skip) {
        global.window = savedWindow;
      }
    });

    it('should spread properties for display:flex when userAgent is all', () => {
      if (skip) {
        return;
      }

      const autoprefix = autoprefixer({
        userAgent: 'all',
      });

      const stylePrepared = autoprefix({
        display: 'inline-flex',
      });

      assert.deepEqual(stylePrepared, {
        display: '-webkit-box; display: -moz-box; display: -ms-inline-flexbox; display: -webkit-inline-flex; display: inline-flex', // eslint-disable-line max-len
      });
    });
  });

  it('should prefix for all when userAgent is all', () => {
    const autoprefix = autoprefixer({
      userAgent: 'all',
    });

    const stylePrepared = autoprefix({
      transform: 'rotate(90)',
    });

    assert.deepEqual(stylePrepared, {
      transform: 'rotate(90)',
      WebkitTransform: 'rotate(90)',
      msTransform: 'rotate(90)',
    });
  });

  it('should prefix for the userAgent when we provid a valid one', () => {
    const autoprefix = autoprefixer({
      userAgent: MSIE9_USER_AGENT,
    });

    const stylePrepared = autoprefix({
      transform: 'rotate(90)',
    });

    assert.deepEqual(stylePrepared, {
      msTransform: 'rotate(90)',
    });
  });

  it('should not prefix when userAgent is false', () => {
    const autoprefix = autoprefixer({
      userAgent: false,
    });

    assert.strictEqual(autoprefix, null);
  });

  it('should not delete ‘display’ property on IE10', () => {
    const autoprefix = autoprefixer({
      userAgent: MSIE10_USER_AGENT,
    });

    const stylePrepared = autoprefix({
      display: 'inline-block',
    });

    assert.deepEqual(stylePrepared, {
      display: 'inline-block',
    });
  });
});
