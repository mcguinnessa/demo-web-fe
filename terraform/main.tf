provider "aws" {
  version = "~> 2.7"
  region  = "eu-west-2" # Setting my region to London. Use your own region here
#  access_key = ""
#  secret_key = ""
}
variable "wrapper_host"  {
  description = "hostname of the wrapper"
  type = string
  default = ""
}

variable "wrapper_port"  {
  description = "port of the wrapper"
  type = string
  default = ""
}

variable "docker_sha"  {
  description = "The SHA from the docker build"
  type = string
  default = ""
}


# No longer need this, using dockerhub repo
#
#resource "aws_ecr_repository" "my_first_ecr_repo" {
#  name = "my-first-ecr-repo" # Naming my repository
#}


#resource "aws_ecs_cluster" "my_cluster" {
#  name = "my-cluster" # Naming the cluster
#}

#      "image": "${aws_ecr_repository.my_first_ecr_repo.repository_url}",
resource "aws_ecs_task_definition" "webfe_task" {
  family                   = "webfe-task" # Naming our first task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "webfe-task",
      "image": "mcguinnessa/web-fe@${var.docker_sha}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ],
      "memory": 2048,
      "cpu": 1024,
      "environment": [
      {
        "name": "NODE_OPTIONS",
        "value": "--trace-warnings"
      },
      {
        "name": "WRAPPER_PORT",
        "value": "${var.wrapper_port}"
      },
      {
        "name": "WRAPPER_HOST",
        "value": "${var.wrapper_host}"
      }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "monitor-logging-container",
          "awslogs-region": "eu-west-2",
          "awslogs-create-group": "true",
          "awslogs-stream-prefix": "webfe"
        }
      }
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 2048         # Specifying the memory our container requires
  cpu                      = 1024         # Specifying the CPU our container requires
#  execution_role_arn       = "${aws_iam_role.ecsTaskExecutionRole.arn}"
  execution_role_arn       = "arn:aws:iam::637423404396:role/AlexECSTaskExecutionRole"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy.json}"
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = "${aws_iam_role.ecsTaskExecutionRole.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "webfe_service" {
  name            = "webfe-service"                             # Naming our first service
  #cluster         = "${aws_ecs_cluster.my_cluster.id}"             # Referencing our created Cluster
  cluster         = "monitor-cluster"
  task_definition = "${aws_ecs_task_definition.webfe_task.arn}" # Referencing the task our service will spin up
  launch_type     = "FARGATE"
  #enable_service_discovery = true
  desired_count   = 1 # Setting the number of containers we want deployed to 3

#  service_connect_configuration {
#    enabled   = true
#    #namespace = "${data.aws_service_discovery_http_namespace.namespace.arn}"
#    #namespace = aws_service_discovery_http_namespace.namespace.arn
#    namespace = "monitor-namespace"
##    service {
##      discovery_name = "md-service"
##      port_name      = "api-port"
##      client_alias {
##        dns_name = "md-wrapper-dns"
##        port     = 3000
##      }
#   }



  load_balancer {
    #target_group_arn = "${aws_lb_target_group.webfe_target_group.arn}" # Referencing our target group
    #target_group_arn = "arn:aws:elasticloadbalancing:eu-west-2:182028175464:targetgroup/web-target-group/36d0fe06e8a225b1"
    #target_group_arn = "arn:aws:elasticloadbalancing:eu-west-2:637423404396:targetgroup/web-target-group/6de0ff81951cb023"
    target_group_arn = "arn:aws:elasticloadbalancing:eu-west-2:637423404396:targetgroup/web-target-group/3362d8cf26b7b5e8"
    container_name   = "${aws_ecs_task_definition.webfe_task.family}"
    container_port   = 3000 # Specifying the container port
  }

#  depends_on = [aws_lb_listener.listener]

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}", "${aws_default_subnet.default_subnet_c.id}"]
    assign_public_ip = true                                                # Providing our containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Setting the security group
  }
}

#resource "aws_service_discovery_http_namespace" "namespace" {
#  name        = "namespace"
#  description = "Namespace for MD Service Discovery"
#}

resource "aws_security_group" "service_security_group" {
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    #security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
    #security_groups = ["sg-039063a37c674e76b", "sg-05aca12900ed1f068"]

    ##  WEB LB , MD LB
    #security_groups = ["sg-0bb3edbeed5618502", "sg-05edc1b1e4b5cd1e2"]
    security_groups = ["sg-0df381f9e766dc9c4"]
  }

  egress {
    from_port   = 0 # Allowing any incoming port
    to_port     = 0 # Allowing any outgoing port
    protocol    = "-1" # Allowing any outgoing protocol
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}

# Providing a reference to our default VPC
resource "aws_default_vpc" "default_vpc" {
}

# Providing a reference to our default subnets
resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "eu-west-2a"
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "eu-west-2b"
}

resource "aws_default_subnet" "default_subnet_c" {
  availability_zone = "eu-west-2c"
}


#
# The Load balancer
#
#resource "aws_alb" "application_load_balancer" {
#  name               = "webfe-lb" # Naming our load balancer
#  load_balancer_type = "application"
#  subnets = [ # Referencing the default subnets
#    "${aws_default_subnet.default_subnet_a.id}",
#    "${aws_default_subnet.default_subnet_b.id}",
#    "${aws_default_subnet.default_subnet_c.id}"
#  ]
#  # Referencing the security group
#  security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
#}
#
## Creating a security group for the load balancer:
#resource "aws_security_group" "load_balancer_security_group" {
#  ingress {
#    from_port   = 80 # Allowing traffic in from port 80
#    to_port     = 80
#    protocol    = "tcp"
#    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic in from all sources
#  }
#
#  egress {
#    from_port   = 0 # Allowing any incoming port
#    to_port     = 0 # Allowing any outgoing port
#    protocol    = "-1" # Allowing any outgoing protocol 
#    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
#  }
#}
#
#resource "aws_lb_target_group" "webfe_target_group" {
#  name        = "webfe-target-group"
#  port        = 80
#  protocol    = "HTTP"
#  target_type = "ip"
#  vpc_id      = "${aws_default_vpc.default_vpc.id}" # Referencing the default VPC
#  health_check {
#    matcher = "200,301,302,308"
#    path = "/"
#  }
#}
#
#resource "aws_lb_listener" "listener" {
#  load_balancer_arn = "${aws_alb.application_load_balancer.arn}" # Referencing our load balancer
#  port              = "80"
#  protocol          = "HTTP"
#  default_action {
#    type             = "forward"
#    target_group_arn = "${aws_lb_target_group.webfe_target_group.arn}" # Referencing our target group
#  }
#}




