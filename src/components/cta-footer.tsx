import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { FormEvent } from "react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Divider } from "./divider";
import { EmailIcon } from "./email-icon";

const CONTACT_EMAIL = "johnie@hjelm.im";
const COMMENT_SUBJECT = encodeURIComponent("Comment on your post");

export function PostFooterCta() {
  const emailFieldId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    if (typeof window === "undefined" || typeof email !== "string") {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    const subject = encodeURIComponent("Subscribe me to your email updates");
    const body = encodeURIComponent(
      [
        "Hey Johnie,",
        "",
        `Please add ${trimmedEmail} to your email updates.`,
        "",
        "Thanks!",
      ].join("\n")
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section>
      <Divider />
      <div className="m-4 flex justify-between">
        <Button
          className="px-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          size="sm"
          variant="link"
        >
          <HugeiconsIcon icon={ArrowUp01Icon} />
          Go to top
        </Button>
        <Button
          className="px-0"
          onClick={() => {
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${COMMENT_SUBJECT}`;
          }}
          size="sm"
          variant="link"
        >
          Email a comment
          <EmailIcon height={16} width={16} />
        </Button>
      </div>
      <Card className="m-4">
        <CardHeader className="items-center text-center">
          <CardTitle>Follow me via email</CardTitle>
          <CardDescription className="mx-auto max-w-xl text-balance text-center">
            I send occasional notes with new writing, practical ideas, and the
            kind of updates that fit better in an inbox than on a social feed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <Field className="gap-2">
                <FieldLabel className="sr-only" htmlFor={emailFieldId}>
                  Email address
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    id={emailFieldId}
                    name="email"
                    placeholder="your@email.com"
                    required
                    type="email"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="sm"
                      type="submit"
                      variant="secondary"
                    >
                      Subscribe
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                <FieldDescription>
                  Submitting opens your email client so you can subscribe with a
                  quick message.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
