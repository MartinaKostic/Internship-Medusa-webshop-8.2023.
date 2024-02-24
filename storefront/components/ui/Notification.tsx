import Link from 'next/link';

const Notification = ({
  notification,
}: {
  notification: string | undefined;
}) => {
  return notification ? (
    <div className="notification-container">
      <div className="notification-modal">
        <div className="notification-content">
          <div className=" font-black text-primary"> {notification} </div>
          {notification.includes('added to cart') && (
            <Link
              href="/cart"
              className="text-xs italic text-primary md:text-sm"
            >
              View Cart
            </Link>
          )}
        </div>
      </div>
    </div>
  ) : (
    ''
  );
};

export default Notification;
