##########################################################
# AWS ECS-CLUSTER
#########################################################

resource "aws_ecs_cluster" "cluster" {
  name = "ecs-devl-cluster"
  tags = {
   name = ecs-cluster-name
   }
}
  
