import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/Input';
import { Heading } from '@/components/ui/Heading';
import { useNotification } from '@/lib/context/notification-context';
import Notification from '@/components/ui/Notification';
import { useForm, Controller } from 'react-hook-form';

export const Footer = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { addNotification, notification } = useNotification();

  const onSubmit = () => {
    addNotification('Congrats, you succesfully subscribed!');
  };
  return (
    <footer className="bg-gray-20 pb-6 text-primary">
      <div className="border-y border-primary pb-18 pt-17">
        <div className="items-center px-4 lg:px-24 xl:grid xl:grid-cols-12">
          <div className="col-span-5 mb-10 xl:mb-0">
            <Heading size="xl" className="mb-4.5 uppercase">
              Don&apos;t be shy, We know you want those discount coupons
            </Heading>

            <p className="text-sm">
              We will also send you our latest drops and news.
            </p>
          </div>

          <span className="col-span-3" />

          <div className="relative col-span-4 items-center md:flex md:gap-10 lg:gap-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex w-full">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  }}
                  render={({ field }) => (
                    <>
                      <Input
                        type="email"
                        label="Your email"
                        wrapperClassName="flex-1 mb-5 md:mb-0 lg:mb-0"
                        className="h-full"
                        {...field}
                      />{' '}
                    </>
                  )}
                />

                <Button size="lg" type="submit">
                  Subscribe
                </Button>
              </div>
              {errors.email && (
                <div className="absolute text-red-700">
                  Invalid email address
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="border-y border-b-primary">
        <div className="flex items-stretch justify-between px-4 lg:px-24">
          <div className="max-w-16 sm:max-w-32 lg:max-w-none">
            <p className="py-6 text-xs font-black uppercase italic sm:text-sm md:text-md lg:py-8 lg:text-lg">
              Nothing is green here
            </p>
          </div>

          <span className="mx-4 border-r border-primary xl:mx-0" />

          <ul className="flex flex-col items-start gap-6 py-6 text-xs md:text-sm lg:flex-row lg:items-center lg:gap-10 lg:py-9">
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/help">Help</Link>
            </li>
            <li>
              <Link href="/">Delivery</Link>
            </li>
            <li>
              <Link href="/">Returns</Link>
            </li>
          </ul>

          <span className="mx-4 border-r border-primary xl:mx-0" />

          <ul className="flex flex-col items-start justify-end gap-6 py-6 text-xs md:text-sm lg:flex-row lg:items-center lg:gap-10 lg:py-9">
            <li>
              <Link href="/">Instagram</Link>
            </li>
            <li>
              <Link href="/">TikTok</Link>
            </li>
            <li>
              <Link href="/">Pinterest</Link>
            </li>
            <li>
              <Link href="/">Facebook</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse justify-between text-xs lg:flex-row lg:px-24 lg:text-sm">
        <div>
          <p className="ml-4 mt-6 lg:ml-0 lg:mt-0">© 2023, Red</p>
        </div>

        <ul className="flex justify-between gap-6 border-b border-primary px-4 pb-6 text-xs md:text-sm lg:gap-10 lg:border-0 lg:px-0 lg:pb-0">
          <li>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </li>
          <li>
            <Link href="/terms-of-use">Terms of Use</Link>
          </li>
        </ul>
      </div>
      {notification && <Notification notification={notification} />}
    </footer>
  );
};
