import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Portal } from 'react-portal';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { compose, withHandlers } from 'recompose';

// Services
import { closeModal, getModalById } from '@services/modals';

// Style
import style from './Modal.scss';

type ModalPropTypes = {
  children: React.Node,
  className: string,
  handleClose: Function,
  id: string,
  isOpened: boolean,
  title: string,
};

const Modal = ({
  children,
  className,
  classNames: { container: containerClassName } = {},
  handleClose,
  isOpened,
  logo = false,
  title,
  ...props
}: ModalPropTypes): React.Element<typeof Portal> => (
  <Portal>
    <CSSTransition
      classNames={{
        enter: style.RootAnimateEnter,
        enterActive: style.RootAnimateEnterActive,
        exit: style.RootAnimateExit,
        exitActive: style.RootAnimateExitActive,
      }}
      in={isOpened}
      timeout={400}
      unmountOnExit
    >
      <div className={classNames(className, style.Root)}>
        <div className={style.Backdrop} onClick={handleClose} />

        <div className={classNames(containerClassName, style.Container)}>
          {title && (
            <div className={style.Title}>
              <FormattedMessage defaultMessage={title} id={title} />

              {logo && <div className={style.Logo} />}
            </div>
          )}

          <div className={style.Content}>
            {typeof children === 'function' ? children(props) : children}
          </div>
        </div>
      </div>
    </CSSTransition>
  </Portal>
);

const mapStateToProps: Function = (
  state: Object,
  { id, isOpened, title }: ModalPropTypes,
) => {
  const modal: Object = getModalById(state, id);

  return {
    isOpened: isOpened || !!modal,
    title: title || get(modal, 'title'),
    ...modal,
  };
};

export default compose(
  connect(
    mapStateToProps,
    { closeModal },
  ),
  withHandlers({
    handleClose: ({ closeModal, id }: ModalPropTypes): Function => (): void =>
      closeModal(id),
  }),
)(Modal);
