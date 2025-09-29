import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';

import InputField from '@/components/ui/form-input';
import SubmitButton from '@/components/ui/form-submit-button';
import TextAreaField from '@/components/ui/form-textarea-field';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextAreaField,
    InputField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
