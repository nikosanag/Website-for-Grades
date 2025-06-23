'use client';

import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';

export default function PostGradesForm() {
  return (
    <form className="space-y-4">
      <TextInput 
        placeholder="Course Name" 
        value="" 
        onChange={() => {}} 
      />
      <Button>Upload</Button>
    </form>
  );
}
