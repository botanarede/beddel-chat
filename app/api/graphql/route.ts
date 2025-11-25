import { handleGraphQLPost, handleGraphQLGet } from "beddel/server/api/graphql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = handleGraphQLPost;
export const GET = handleGraphQLGet;
