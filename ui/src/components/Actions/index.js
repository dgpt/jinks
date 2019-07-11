import React, { PureComponent } from 'react';
import Button from '@instructure/ui-buttons/lib/Button'
import { colors } from 'shared/constants';

const buttonTheme = {
  primaryBackground: colors.background,
  primaryBorderColor: colors.primary,
  primaryHoverBackground: colors.primary,
  primaryColor: colors.text
}

export default function({ onDeleteEdge, selectedEdge }) {
  return (
    <div>
      {selectedEdge && onDeleteEdge && (
        <Button
          variant="primary"
          theme={buttonTheme}
          onClick={onDeleteEdge}
        >
          Delete Link
        </Button>
      )}
    </div>
  );
}
