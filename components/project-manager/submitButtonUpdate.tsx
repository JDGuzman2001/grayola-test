import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full p-3 bg-green-400 text-black hover:bg-fuchsia-400 border border-black mt-2"
      aria-disabled={pending}
    >
      {pending ? 'Loading...' : 'Update Project'}
    </Button>
  );
}

export default SubmitButton;