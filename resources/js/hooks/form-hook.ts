import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';

import SubmitButton from '@/components/ui/form-submit-button';
import TextAreaField from '@/components/ui/form-textarea-field';
import NumberField from '@/components/ui/number-input';
import TextField from '@/components/ui/text-input';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextAreaField,
    NumberField,
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
