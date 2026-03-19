# Honestly Repo Instructions

- When a ticket is completed and you summarize the work for the user, always include a `Review my work` section.
- The `Review my work` section should give short, concrete steps for how to verify the change in the app, focused on the exact ticket that was completed.
- Before any future `git push`, always run `npm run build` and do not push if the production build has not been verified or is failing.
- If `npm run build` fails before a push, fix the build issue, rerun the build, and only push after the build passes.
