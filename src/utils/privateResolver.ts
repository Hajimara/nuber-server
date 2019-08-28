const privateResolver = resolverFunction => async (
  perent,
  args,
  context,
  info
) => {
  if (!context.req.user) {
    throw new Error("No JWT. I refuse to proceed");
  }
  const resolved = await resolverFunction(perent, args, context, info);
  return resolved;
};

export default privateResolver;
