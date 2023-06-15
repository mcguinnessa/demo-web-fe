###########################################################
# AWS ECS-EC2
###########################################################
resource "aws_instance" "ec2_instance" {
  ami                    = "ami-0eb260c4d5475b901"
  subnet_id              =  "subnet-0ca48a1d1c277430f" #CHANGE THIS
  instance_type          = "t2.micro"
  iam_instance_profile   = "ecsInstanceRole" #CHANGE THIS
  vpc_security_group_ids = ["sg-01849003c4f9203ca"] #CHANGE THIS
  key_name               = "adm_aws_putty_key" #CHANGE THIS
  ebs_optimized          = "false"
  source_dest_check      = "false"
  user_data              = "${data.template_file.user_data.rendered}"
  root_block_device = {
    volume_type           = "gp2"
    volume_size           = "30"
    delete_on_termination = "true"
  }

  tags {
    Name                   = "openapi-ecs-ec2_instance"
}

  lifecycle {
    ignore_changes         = ["ami", "user_data", "subnet_id", "key_name", "ebs_optimized", "private_ip"]
  }
}

data "template_file" "user_data" {
  template = "${file("${path.module}/user_data.tpl")}"
}
