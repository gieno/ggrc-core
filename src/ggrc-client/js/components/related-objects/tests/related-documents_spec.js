/*
 Copyright (C) 2018 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

import {getComponentVM} from '../../../../js_specs/spec_helpers';
import Component from '../related-documents';

describe('related-documents component', function () {
  'use strict';

  let viewModel;
  let instance;

  beforeEach(function () {
    viewModel = getComponentVM(Component);
    instance = {
      id: '5',
      type: 'Assessment',
    };

    viewModel.attr('instance', instance);
  });

  describe('"getDocumentsQuery" method', function () {
    function checkAdditionFilter(kind) {
      let query;
      let additionFilter;
      viewModel.attr('kind', kind);
      query = viewModel.getDocumentsQuery();

      expect(query.filters.expression).toBeDefined();
      additionFilter = query.filters.expression.right;
      expect(additionFilter.left).toEqual('kind');
      expect(additionFilter.right).toEqual(kind);
    }

    it('should get query for urls', function () {
      checkAdditionFilter('URL');
    });

    it('should get query for evidences', function () {
      checkAdditionFilter('FILE');
    });

    it('should get query for all documents', function () {
      let query;
      let expression;
      viewModel.attr('kind', undefined);
      query = viewModel.getDocumentsQuery();
      expression = query.filters.expression;
      expect(expression).toBeDefined();
      expect(expression.object_name).toEqual(instance.type);
      expect(expression.ids[0]).toEqual(instance.id);
    });
  });
});
