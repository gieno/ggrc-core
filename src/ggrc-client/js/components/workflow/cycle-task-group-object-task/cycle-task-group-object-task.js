/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import template from './templates/cycle-task-group-object-task.mustache';
import '../../object-change-state/object-change-state';
import '../../dropdown/dropdown';
import RefreshQueue from '../../../models/refresh_queue';

let viewModel = can.Map.extend({
  showLink: function () {
    let pageInstance = GGRC.page_instance();

    return pageInstance.type !== 'Workflow';
  },
  instance: {},
  initialState: 'Assigned',
  cycle: {},
  workflow: {},
  init: function () {
    this.loadCycle()
      .then(this.loadWorkflow.bind(this));
  },
  loadCycle: function () {
    let stubCycle = this.attr('instance.cycle').reify();
    let dfdResult;

    if (!_.isEmpty(stubCycle)) {
      dfdResult = new RefreshQueue()
        .enqueue(stubCycle)
        .trigger()
        .then(_.first)
        .then(function (cycle) {
          this.attr('cycle', cycle);
          return cycle;
        }.bind(this));
    } else {
      dfdResult = can.Deferred().reject();
    }

    return dfdResult;
  },
  loadWorkflow: function (cycle) {
    let workflow = cycle.attr('workflow').reify();

    return new RefreshQueue().enqueue(workflow)
      .trigger()
      .then(_.first)
      .then(function (loadedWorkflow) {
        this.attr('workflow', loadedWorkflow);
      }.bind(this));
  },
  onStateChange: function (event) {
    let instance = this.attr('instance');
    let newStatus = event.state;

    instance.refresh()
      .then(function (refreshed) {
        refreshed.attr('status', newStatus);
        return refreshed.save();
      });
  },
});

export default GGRC.Components('cycleTaskGroupObjectTask', {
  tag: 'cycle-task-group-object-task',
  template: template,
  viewModel: viewModel,
});
