import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// Containers
import Search from './Search';

// Style
import style from './Header.scss';

type MediaHeaderPropTypes = {
  count: number,
  initialValues: {
    search: string,
  },
  onReset: Function,
  onSearch: Function,
};

const MediaHeader = ({
  count = 0,
  initialValues,
  onReset,
  onSearch,
}: MediaHeaderPropTypes): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Left}>
      <div className={style.Title}>
        <FormattedMessage defaultMessage="Media Library" id="media.title" />
      </div>

      <div className={style.Count}>
        <FormattedMessage defaultMessage="media items" id="media.count">
          {message => `(${count} ${message})`}
        </FormattedMessage>
      </div>
    </div>

    <div className={style.Right}>
      <Search
        initialValues={initialValues}
        onReset={onReset}
        onSubmit={onSearch}
      />
    </div>
  </div>
);

export default MediaHeader;
export type { MediaHeaderPropTypes };
