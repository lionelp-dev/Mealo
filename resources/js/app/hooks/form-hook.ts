import { fieldContext, formContext } from './form-context';
import CheckboxField from '@/app/components/ui/form-checkbox-field';
import EmailField from '@/app/components/ui/form-email-field';
import RadioField from '@/app/components/ui/form-radio-field';
import SelectField from '@/app/components/ui/form-select-field';
import SubmitButton from '@/app/components/ui/form-submit-button';
import TextAreaField from '@/app/components/ui/form-textarea-field';
import { MultiSelectField } from '@/app/components/ui/multi-select-field';
import NumberField from '@/app/components/ui/number-input';
import TextField from '@/app/components/ui/text-input';
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
    MultiSelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
