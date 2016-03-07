
import styles from './index.scss';
import React from 'react';
import cssModules from 'react-css-modules';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MessageBox from '../MessageBox';

function SelectorBox({
  readme = 'Hi!',
  feedback,
  selectors = [],
  submitText = 'Submit',
  handleSubmit,
}) {
  let feedbackBlock, submitBlock;
  const fieldsInRow = selectors.length % 2 === 0 ? 2 : 3;
  const selectorsWithRow = [];
  selectors.forEach((selector, i) => {
    if (i % fieldsInRow === 0) {
      selectorsWithRow.push([]);
    }
    selectorsWithRow[selectorsWithRow.length - 1].push(selector);
  });
  if (feedback) {
    feedbackBlock = (
      <MessageBox
        message={feedback}
        titleStyle={styles['feedback-header']}
        successStyle={styles['feedback-success']}
        errorStyle={styles['feedback-error']} />
    );
  }
  if (handleSubmit) {
    submitBlock = (
      <div styleName="submit"
        onClick={
          () => {
            const res = {};
            selectors.forEach((selector) => {
              res[selector.name] = selector.value;
            });
            handleSubmit(res);
          }
        } >
        {submitText}
      </div>
    );
  }
  return (
    <div styleName="box">
      <form styleName="form">
        <div styleName="readme">{readme}</div>
        {selectorsWithRow.map((row, i) =>
          <div key={i}
            styleName={fieldsInRow === 2 ? 'two-fields' : 'three-fields'}>
            {row.map((selector) =>
              <div styleName="field" key={selector.id}>
                <select
                  styleName={selector.value
                    ? 'dropdown' : 'dropdown-placeholder'}
                  name={selector.name}
                  value={selector.value}
                  onChange={selector.handleChange}>
                  <option value="">{selector.placeholder}</option>
                  {selector.options.map((option) =>
                    <option key={option.id}
                      value={option.value}>{option.label}</option>
                  )}
                </select>
              </div>
            )}
          </div>
        )}
        <div styleName="actions">
          {submitBlock}
        </div>
        <ReactCSSTransitionGroup
          styleName="feedback"
          transitionName={{
            enter: styles['feedback-enter'],
            enterActive: styles['feedback-enter-active'],
            leave: styles['feedback-leave'],
            leaveActive: styles['feedback-leave-active'],
          }}
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}>
          {feedbackBlock}
        </ReactCSSTransitionGroup>
      </form>
    </div>
  );
}

export default cssModules(SelectorBox, styles);