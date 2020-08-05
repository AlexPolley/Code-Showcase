// Originally written by Chris Janes

#pragma strict

public var startingNode:Node;
@Range(0.1, 10)
public var speed:float;

public var sideOn:boolean;

private var currentNode:Node;
public var targetLocation:Vector2;

function Start () {
	currentNode = startingNode;	
	SetTargetLocation();
}

function SetTargetLocation()
{
	targetLocation = currentNode.transform.position;
	if ( sideOn )
		targetLocation.y = transform.position.y;
}

function NextNode()
{
	currentNode = currentNode.next;
	SetTargetLocation();
}

function Update () {
	var distance:float = Vector2.Distance(transform.position, targetLocation);
	
	if ( distance > .1f )
	{
		var direction:Vector2 = targetLocation - transform.position;
		direction.Normalize();
		transform.position += direction * speed * Time.deltaTime;
	} else {
		NextNode();
	}
}