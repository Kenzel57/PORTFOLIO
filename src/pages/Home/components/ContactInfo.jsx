import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebookF } from "react-icons/fa6";

const socials = [
  { label: "Instagram", href: "https://instagram.com/yourhandle", Icon: FaInstagram },
  { label: "TikTok", href: "https://tiktok.com/@yourhandle", Icon: FaTiktok },
  { label: "WhatsApp", href: "https://wa.me/237000000000", Icon: FaWhatsapp },
  { label: "Facebook", href: "https://facebook.com/yourpage", Icon: FaFacebookF },
];

export default function ContactInfo() {
  return (
    <>
      <div className="pointer-events-auto absolute bottom-4 left-4 hidden text-[clamp(0.6rem,0.75vw,0.8rem)] leading-tight md:block">
        <div>Ken</div>
        <a href="mailto:hello@example.com">by@kenzel.com</a>
        <div>+00 000 000 000</div>
      </div>

      <div className="pointer-events-auto absolute bottom-4 right-4 hidden items-center gap-[clamp(0.75rem,1vw,1.25rem)] md:flex">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className="transition-transform duration-200 hover:scale-125"
          >
            <Icon className="size-[clamp(0.9rem,1.15vw,1.25rem)]" />
          </a>
        ))}
      </div>
    </>
  );
}