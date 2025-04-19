// /app/lib/userForm.ts

export const userFormFields = [
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: ['Institution representative', 'Instructor', 'Student']
    },
    {
      key: 'username',
      label: 'User Name',
      placeholder: 'Enter username',
      type: 'text'
    },
    {
      key: 'password',
      label: 'Password',
      placeholder: 'Enter password',
      type: 'password'
    },
    {
      key: 'id',
      label: 'ID',
      placeholder: 'Enter user ID',
      type: 'text'
    }
  ];
  