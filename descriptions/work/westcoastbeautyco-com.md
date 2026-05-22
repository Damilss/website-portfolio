[repo link](https://github.com/Damilss/westcoastbeautyco.com)

# West Coast Beauty Co.

> A brand site for a beauty & wellness company — storefront polish, real integrations.

West Coast Beauty Co. is a marketing and brand website for a beauty and
wellness company, built with Next.js, TypeScript, and Tailwind CSS. Beyond the
storefront polish, it wires up two real integrations: a server-side contact
form and a live Instagram feed.

![West Coast Beauty Co.](/work-assets/westcoastbeautyco-com/site.jpg)

## The two integrations

**Contact form** — the `/contact` form is delivered server-side with Resend.
Submissions land in the brand inbox with the sender's address set as Reply-To,
so replying just works.

**Instagram feed** — the homepage pulls recent posts from a public Behold JSON
feed, fetched client-side with no API keys and no server of its own. The fetch
is abortable and cancels cleanly if the component unmounts mid-request:

```tsx
useEffect(() => {
  const controller = new AbortController();
  let cancelled = false;

  // Recent posts from the public Behold feed — no API keys, no backend
  fetchBeholdFeed({ feedUrl, limit, signal: controller.signal })
    .then((payload) => {
      if (cancelled) return;
      setItems(payload.items);
      setProfile(payload);
    })
    .catch((error) => {
      if (cancelled || error.name === "AbortError") return;
      setHasError(true);
    });

  return () => {
    cancelled = true;
    controller.abort();
  };
}, [limit, feedUrl]);
```

*A `cancelled` flag and an `AbortController` together guard against setting state after unmount.*

## Tech stack

- Next.js (App Router), React, TypeScript, Tailwind CSS
- Resend for transactional contact-form email
- Behold for the public Instagram feed

## Status

Active — client brand site.
