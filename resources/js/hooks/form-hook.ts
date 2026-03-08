import { fieldContext, formContext } from './form-context';
import CheckboxField from '@/components/ui/form-checkbox-field';
import EmailField from '@/components/ui/form-email-field';
import RadioField from '@/components/ui/form-radio-field';
import SelectField from '@/components/ui/form-select-field';
import SubmitButton from '@/components/ui/form-submit-button';
import TextAreaField from '@/components/ui/form-textarea-field';
import NumberField from '@/components/ui/number-input';
import TextField from '@/components/ui/text-input';
import { createFormHook } from '@tanstack/react-form';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextAreaField,
    NumberField,
    TextField,
    EmailField,
    SelectField,
    CheckboxField,
    RadioField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
