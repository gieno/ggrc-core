/*
 Copyright (C) 2018 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

import {makeFakeInstance} from '../../../../js_specs/spec_helpers';
import {getComponentVM} from '../../../../js_specs/spec_helpers';
import Component from '../tree-item-extra-info';
import CycleTaskGroupObjectTask from '../../../models/business-models/cycle-task-group-object-task';
import * as businessModels from '../../../models/business-models';
import TreeViewConfig from '../../../apps/base_widgets';

describe('tree-item-extra-info component', function () {
  'use strict';

  let viewModel;
  let activeModel = [
    'Regulation',
    'Contract',
    'Policy',
    'Standard',
    'Requirement',
  ];

  beforeEach(function () {
    viewModel = getComponentVM(Component);
  });

  describe('is active if', function () {
    it('workflow_state is defined', function () {
      viewModel.attr('instance', {workflow_state: 'far'});
      expect(viewModel.attr('isActive')).toBeTruthy();
    });

    activeModel.forEach(function (model) {
      it('instance is ' + model, function () {
        viewModel.attr('instance', makeFakeInstance(
          {model: businessModels[model]}
        )());
        expect(viewModel.attr('isActive')).toBeTruthy();
      });
    });
  });

  describe('is not active if', function () {
    let allModels = Object.keys(TreeViewConfig.attr('base_widgets_by_type'));
    let notActiveModels = _.difference(allModels, activeModel);

    it('workflow_state is not defined', function () {
      viewModel.attr('instance', {title: 'FooBar'});
      expect(viewModel.attr('isActive')).toBeFalsy();
    });

    notActiveModels.forEach(function (model) {
      if (businessModels[model]) {
        it('instance is ' + model, function () {
          viewModel.attr('instance', makeFakeInstance(
            {model: businessModels[model]}
          )());
          expect(viewModel.attr('isActive')).toBeFalsy();
        });
      }
    });
  });

  describe('isOverdue property', function () {
    it('returns true if workflow_status is "Overdue"', function () {
      let result;
      viewModel.attr('instance', {
        workflow_state: 'Overdue',
      });

      result = viewModel.attr('isOverdue');

      expect(result).toBe(true);
    });

    it('returns false if workflow_status is not "Overdue"', function () {
      let result;
      viewModel.attr('instance', {
        workflow_state: 'AnyState',
      });

      result = viewModel.attr('isOverdue');

      expect(result).toBe(false);
    });

    it('returns true if instance is "CycleTasks" and overdue', function () {
      let result;
      let instance = makeFakeInstance({
        model: CycleTaskGroupObjectTask,
      })();
      instance.attr('end_date', moment().subtract(5, 'd'));
      viewModel.attr('instance', instance);

      result = viewModel.attr('isOverdue');

      expect(result).toBe(true);
    });

    it('returns false if instance is "CycleTasks" and not overdue',
      function () {
        let result;
        let instance = makeFakeInstance({
          model: CycleTaskGroupObjectTask,
        })();
        instance.attr('end_date', moment().add(5, 'd'));
        viewModel.attr('instance', instance);

        result = viewModel.attr('isOverdue');

        expect(result).toBe(false);
      });
  });
});
