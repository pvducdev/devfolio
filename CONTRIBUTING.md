# Contributing

Contributions are welcome. Follow these guidelines to maintain code quality and project consistency.

## Setup

Fork, clone, and set up the project:

```bash
git clone https://github.com/YOUR_USERNAME/devfolio.git
cd devfolio
pnpm install
# Configure .env with required keys
pnpm dev
```

## Workflow

1. Create a feature branch from `develop`
2. Make changes following code guidelines below
3. Run `pnpm check && pnpm test`
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/) format
5. Open a PR against `develop`

## Code Guidelines

- **Linting**: Biome + ultracite preset (run `pnpm fix`)
- **Testing**: Write tests for new features (`pnpm test`)
- **Style**: Follow existing patterns, use Tailwind utilities
- **Validation**: Use Valibot
- **i18n**: Add translations to `messages/en/*.json` and `messages/vi/*.json`

### Commit Message Convention

I follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Example**: `feat(projects): add filtering by technology`

## Issues

- **Bugs**: Include reproduction steps, expected vs actual behavior, environment details
- **Features**: Describe use case and value proposition
- **Large changes**: Discuss in an issue before implementing

## Code of Conduct

Follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Report unacceptable behavior via issues.

## License

Contributions are licensed under the [project's license](./LICENSE).
