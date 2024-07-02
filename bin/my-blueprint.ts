// #!/usr/bin/env node
// import 'source-map-support/register';
// import * as cdk from 'aws-cdk-lib';
// import { MyBlueprintStack } from '../lib/my-blueprint-stack';

// const app = new cdk.App();
// new MyBlueprintStack(app, 'MyBlueprintStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';

const app = new cdk.App();

// AddOns for the cluster.
const addOns: Array<blueprints.ClusterAddOn> = [
    new blueprints.addons.ArgoCDAddOn,
    new blueprints.addons.CalicoOperatorAddOn,
    new blueprints.addons.MetricsServerAddOn,
    new blueprints.addons.ClusterAutoScalerAddOn,
    //new blueprints.addons.ContainerInsightsAddOn,
    new blueprints.addons.AwsLoadBalancerControllerAddOn(),
    new blueprints.addons.VpcCniAddOn(),
    new blueprints.addons.CoreDnsAddOn(),
    new blueprints.addons.KubeProxyAddOn(),
    new blueprints.addons.EfsCsiDriverAddOn(),
   // new blueprints.addons.XrayAddOn()
];


const props: blueprints.MngClusterProviderProps = {
    minSize: 1,
    maxSize: 10,
    desiredSize: 4,    
    instanceTypes: [new ec2.InstanceType('m5.large')],
    amiType: eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
    nodeGroupCapacityType: eks.CapacityType.ON_DEMAND,
    amiReleaseVersion: "1.30.0-20240615" // this will upgrade kubelet to 1.30.0
};

const account = '929556976395';
const region = 'us-east-1';
const version = 'auto';

// const stack = blueprints.EksBlueprint.builder()
//     .account(account)
//     .region(region)
//     .version(version)
//     .addOns(...addOns)
//     .build(app, 'eks-blueprint');
// do something with stack or drop this variable
const clusterProvider = new blueprints.MngClusterProvider(props);
new blueprints.EksBlueprint(app, { id: 'blueprint-1', addOns, teams: [], clusterProvider, version: eks.KubernetesVersion.V1_30 });