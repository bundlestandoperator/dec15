import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full pt-6 pb-24 mt-14 bg-lightgray">
      <div className="md:hidden px-5 mx-auto">
        <div className="flex flex-col gap-8">
          <div>
            <h4 className="block text-sm text-gray mb-3">
              Subscribe to our newsletter <br /> for exclusive deals and updates
            </h4>
            <div className="relative h-11 w-[270px]">
              <button className="peer w-[104px] h-[40px] absolute left-[164px] top-1/2 -translate-y-1/2 rounded font-semibold text-white">
                Subscribe
              </button>
              <div className="peer-hover:bg-[#cc8100] peer-hover:[background:linear-gradient(to_bottom,_#cc8100_5%,_#e29000_100%)] peer-active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.14)] w-full h-full p-[2px] rounded-lg shadow-[inset_0px_1px_0px_0px_#ffa405] [background:linear-gradient(to_bottom,_#e29000_5%,_#cc8100_100%)] bg-[#e29000]">
                <input
                  className="w-40 h-[40px] px-3 rounded-md"
                  type="text"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                About us
              </Link>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                Privacy policy
              </Link>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                Terms of service
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get Help</h3>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                Contact us
              </Link>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                Track order
              </Link>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                Returns & refunds
              </Link>
              <Link
                href="#"
                className="block w-max text-sm text-gray mb-2 hover:underline"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-full max-w-[1040px] px-9 mx-auto">
        <div className="flex gap-10">
          <div className="w-full">
            <h3 className="font-semibold mb-4">Company</h3>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              About us
            </Link>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              Privacy policy
            </Link>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              Terms of service
            </Link>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-4">Get Help</h3>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              Contact us
            </Link>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              Track order
            </Link>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              Returns & refunds
            </Link>
            <Link
              href="#"
              className="block w-max text-sm text-gray mb-2 hover:underline"
            >
              FAQs
            </Link>
          </div>
          <div className="w-[270px]">
            <h4 className="block text-sm text-gray mb-3">
              Subscribe to our newsletter <br /> for exclusive deals and updates
            </h4>
            <div className="relative h-11 w-[270px]">
              <button className="peer w-[104px] h-[40px] absolute left-[164px] top-1/2 -translate-y-1/2 rounded font-semibold text-white">
                Subscribe
              </button>
              <div className="peer-hover:bg-[#cc8100] peer-hover:[background:linear-gradient(to_bottom,_#cc8100_5%,_#e29000_100%)] peer-active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.14)] w-full h-full p-[2px] rounded-lg shadow-[inset_0px_1px_0px_0px_#ffa405] [background:linear-gradient(to_bottom,_#e29000_5%,_#cc8100_100%)] bg-[#e29000]">
                <input
                  className="w-40 h-[40px] px-3 rounded-md"
                  type="text"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
