import { PrismaClient } from "@prisma/client"
import { randomBytes, scryptSync } from "node:crypto"
import { seedCatalog } from "./seed-catalog.mjs"

const prisma = new PrismaClient()
const posts = [
  { slug: "java-queue-empty", title: "Handling an empty queue in Java", summary: "A small edge case, a surprising exception. Build a queue that behaves correctly when there is nothing left to remove.", topic: "Java", kind: "Error & solution", author: "Technovation team", body: `## The problem\nCalling next() on an empty iterator throws NoSuchElementException. A queue’s poll() method should instead return null when the queue is empty.\n\`\`\`java\n// Throws when the queue is empty\nIterator<T> iterator = elements.iterator();\nT item = iterator.next();\n\`\`\`\n## Why it happens\nAn iterator must have a next element before next() can be called. Checking the returned value for null happens too late: the exception has already been thrown.\n## The solution\nWhen your backing collection is a LinkedList, delegate to its queue methods. These already handle the empty case.\n\`\`\`java\n@Override\npublic T poll() {\n    return elements.poll();\n}\n\n@Override\npublic T peek() {\n    return elements.peek();\n}\n\`\`\`\n## Verify the fix\nTest both an empty queue and a queue with one element. After removing that element, a second poll should return null.\n## Takeaway\nCheck empty states as carefully as the happy path. Prefer the backing collection’s existing operations when they match your queue’s contract.` },
  { slug: "java-null-check", title: "Avoiding null values at Java boundaries", summary: "Fail early with a clear message when a required value is missing.", topic: "Java", kind: "Code snippet", author: "Technovation team", body: `## The problem\nA missing value can travel through several methods before causing a NullPointerException. Validate required inputs at the boundary.\n## The solution\n\`\`\`java\nimport java.util.Objects;\n\npublic String normalizeName(String name) {\n    Objects.requireNonNull(name, "name is required");\n    return name.trim();\n}\n\`\`\`\n## Verify the fix\nPass a normal string, a string with surrounding spaces, and null.` },
  { slug: "devops-container-logs", title: "Finding the cause of a stopped container", summary: "Use container status and logs to narrow down an application startup failure.", topic: "DevOps", kind: "Error & solution", author: "Technovation team", body: `## The problem\nA container exits immediately after startup. Start by identifying the failed container and reading its application output.\n## Inspect the failure\n\`\`\`bash\ndocker ps -a\ndocker logs --tail 100 app-container\ndocker inspect --format='{{.State.ExitCode}}' app-container\n\`\`\`\n## Find the cause\nLook for the first application error. Common causes include a missing configuration value, an unavailable dependency, or an incorrect startup command.\n## Verify the fix\nAfter correcting the configuration and restarting through your normal deployment process, check the logs again.` },
  { slug: "java-resource-handling", title: "Closing resources with try-with-resources", summary: "Keep file handling predictable, including when reading fails.", topic: "Java", kind: "Guide", author: "Technovation team", body: `## The problem\nA file reader needs to close even if an exception interrupts processing. Manual cleanup is easy to miss.\n## The solution\n\`\`\`java\nimport java.io.IOException;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\n\npublic String readFirstLine(Path path) throws IOException {\n    try (var reader = Files.newBufferedReader(path)) {\n        return reader.readLine();\n    }\n}\n\`\`\`\n## Verify the fix\nTry a file with content, an empty file, and a missing path.` },
  { slug: "devops-ci-checklist", title: "A practical checklist for a failing build", summary: "Separate a code failure from an environment or dependency problem.", topic: "DevOps", kind: "Guide", author: "Technovation team", body: `## Start with the first failure\nRead the earliest failed command in the build log. Later failures may be consequences of that first error.\n## Compare environments\nRecord the runtime version, dependency lockfile, working directory, and build command. Compare them with a successful local build.\n## Reproduce the command\nRun the exact failing build step in a clean checkout with the same runtime.\n## Verify the fix\nRun the pipeline on the corrected commit.` },
  { slug: "devops-port-check", title: "Checking which process is listening on a port", summary: "A quick Linux diagnostic when an application reports that its port is already in use.", topic: "DevOps", kind: "Code snippet", author: "Technovation team", body: `## The problem\nAn application cannot start because another process already occupies its configured port.\n## Inspect listening ports\n\`\`\`bash\nss -ltnp\n\`\`\`\n## Read the result\nFind the application’s port in the Local Address column.\n## Verify the fix\nChoose an available application port or resolve the conflicting service through its normal configuration.` },
]

function passwordHash(password) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `scrypt$${salt}$${hash}`
}

async function main() {
  await seedCatalog(prisma)
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: { id: post.slug, ...post, status: "PUBLISHED", publishedAt: new Date() },
    })
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || "Technovation Admin"
  if (email && password && password !== "replace-with-a-long-unique-password") {
    await prisma.admin.upsert({
      where: { email },
      update: { name, passwordHash: passwordHash(password) },
      create: { name, email, passwordHash: passwordHash(password) },
    })
    console.log(`Admin ready: ${email}`)
  } else {
    console.log("Seeded sample posts. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env, then run npm run db:seed to create the admin account.")
  }
}

main().finally(() => prisma.$disconnect())
