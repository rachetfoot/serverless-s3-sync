function resolveStackOutput(plugin, outputKey) {
  const provider = plugin.serverless.getProvider('aws');
  const awsCredentials = provider.getCredentials();
  if (!awsCredentials.credentials) {
    awsCredentials.credentials = new provider.sdk.Credentials(awsCredentials);
  }
  const cfn = new provider.sdk.CloudFormation({
    region: provider.getRegion(),
    credentials: awsCredentials.credentials
  });
  const stackName = provider.naming.getStackName();

  return cfn
    .describeStacks({ StackName: stackName })
    .promise()
    .then(data => {
      const output = data.Stacks[0].Outputs.find(
        e => e.OutputKey === outputKey
      );
      if (!output) {
        throw `Failed to resolve stack Output '${outputKey}' in stack '${stackName}'`;
      }
      return output.OutputValue;
    });
}

module.exports = resolveStackOutput;
