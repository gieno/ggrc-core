/*
 Copyright (C) 2018 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

import template from './tree_pagination.mustache';

/**
 * A component that renders a tree pagination widget
 * Usage: <tree-pagination paging="paging"></tree-pagination>
 */
(function (GGRC, can) {
  GGRC.Components('treePagination', {
    tag: 'tree-pagination',
    template: template,
    init: function () {
      /**
       * Entrance object validation
       *
       * paging = {
       *  current: {Number}, - current page number
       *  pageSize: {Number}, - amount elements on the page
       *  total: {Number}, - total amount of elements
       *  count: {Number}, - total amount of pages
       *  pageSizeSelect: {Array} - array of numbers that used for pageSize popover
       *  disabled: {Boolean} - true if frontend doesn't finish request to the server otherwise false
       * }
       */
      if (!this.viewModel.attr('paging')) {
        throw new Error('Paging object didn\'t init');
      }
    },
    viewModel: {
      /**
       * Gets value from input and after validation set it to paging.current
       * @param {Object} object - paging object
       * @param {Object} input - DOM element
       * @param {Object} event - DOM event
       */
      setCurrentPage: function (object, input, event) {
        let _value;
        let _page;
        event.stopPropagation();
        if (!this.paging.attr('disabled') && input.val() !== '') {
          _value = parseInt(input.val(), 10);
          _page = Math.min(Math.max(_value, 1) || 1, this.paging.count);

          this.paging.attr('current', _page);
        }
        input.val('');
        input.blur();
      },
      setLastPage: function () {
        this.paging.attr('current', this.paging.count);
      },
      setFirstPage: function () {
        this.paging.attr('current', 1);
      },
      setPrevPage: function () {
        this.paging.attr('current', this.paging.current - 1);
      },
      setNextPage: function () {
        this.paging.attr('current', this.paging.current + 1);
      },
      getPaginationInfo: function () {
        let _current = this.attr('paging.current');
        let _size = this.attr('paging.pageSize');
        let _total = this.attr('paging.total');
        let _first;
        let _last;

        _first = (_current - 1) * _size + 1;
        _last = _current * _size < _total ? _current * _size : _total;

        return _last ? _first + '-' + _last + ' of ' + _total :
          'No records';
      },
      getPaginationPlaceholder: function () {
        let _current = this.attr('paging.current');
        let _count = this.attr('paging.count');

        if (_count && _count >= _current) {
          return 'Page ' + _current + ' of ' + _count;
        } else if (!_count) {
          return '';
        }

        return 'Wrong value';
      }
    }
  });
})(window.GGRC, window.can);
