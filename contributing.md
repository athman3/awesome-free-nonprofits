# Contribution Guidelines

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

## Adding to the List

If you have a free service or resource for nonprofits that you'd like to add to this awesome list, please follow these guidelines:

### Requirements

- The service must offer a **free** or significantly discounted program specifically for nonprofit organizations
- The offer should be clearly documented on the service provider's official website
- Include a direct link to the nonprofit program page
- Provide a brief, clear description of what's offered
- Ensure the service is currently active and available

### How This Project Works

This project uses a **single source of truth**: `scripts/services.json`. The README.md and the web application are both **automatically generated** from this JSON file.

```
scripts/services.json  →  generate.js  →  README.md
                                      →  app/src/data/services.json
```

### Submission Process

You'll need a [GitHub account](https://github.com/join)!

1. Access this repository's GitHub page: https://github.com/athman3/awesome-free-nonprofits
2. Navigate to `scripts/services.json`
3. Click on the edit icon
4. Add your service entry following the format below
5. Say why you're proposing the changes, and then click on "Propose file change"
6. Submit the [pull request](https://help.github.com/articles/using-pull-requests/)!

### Format Requirements

Add your service to `scripts/services.json` with the following structure:

```json
{
  "Service Name": {
    "url": "https://link-to-nonprofit-program",
    "about": "Short objective description of what the service is.",
    "offer": "Detailed description of what's available for nonprofits.",
    "score": 80,
    "categories": ["Category Name"]
  }
}
```

**Fields:**
- **`url`**: Direct link to the nonprofit program page
- **`about`**: One concise sentence describing what the service IS (not what it offers). Starts with uppercase, ends with period.
- **`offer`**: Detailed description of the nonprofit program benefits
- **`score`** (1-100): How valuable/comprehensive the nonprofit offering is
- **`categories`**: Array of categories the service belongs to

**Available Categories:**
- Infrastructure & Security
- Design & Creative
- Communication & Collaboration
- Marketing & CRM
- Productivity & Analytics
- Education & Training
- Business & Operations

**Example:**

```json
{
  "Slack": {
    "url": "https://slack.com/pricing",
    "about": "Team communication platform with channels, direct messaging, and video calls.",
    "offer": "Up to 85% discount on Pro, Business+, and Enterprise Grid plans for 501(c)(3) nonprofits.",
    "score": 92,
    "categories": ["Communication & Collaboration"]
  }
}
```

**Guidelines for `about` field (becomes README description):**
- ✅ `"Team communication platform with channels, direct messaging, and video calls."`
- ✅ `"Online design platform for creating graphics and marketing materials."`
- ❌ `"Up to 85% discount on Pro plans for nonprofits."` (describes offer, not what it is)
- ❌ `"Free Canva Pro with unlimited templates."` (describes offer, not what it is)

### Quality Standards

- Links must be direct and working (link to the nonprofit program page, not the main website)
- No promotional language in `about` - be factual and objective
- Check for duplicates before submitting
- Verify the service is still active and available
- Services should be alphabetically ordered by name in the JSON file

## For Developers

To regenerate README.md and app data after editing `scripts/services.json`:

```bash
npm run generate
```

Or use watch mode during development:

```bash
npm run dev
```

## Updating Your Pull Request

Sometimes, a maintainer will ask you to edit your Pull Request before it is included. This is normally due to spelling errors or because your PR didn't match the guidelines.

[Here](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md) is a write up on how to change a Pull Request and the different ways you can do that.

## Reporting Issues

If you find:
- Broken links
- Services that are no longer available
- Incorrect information
- Services that should be added

Please [open an issue](../../issues) with details.

## Questions?

If you have any questions about contributing, feel free to [open an issue](../../issues) and we'll be happy to help!

## Thank You

Your contributions to this project help nonprofit organizations discover valuable free resources. Thank you for taking the time to contribute!

