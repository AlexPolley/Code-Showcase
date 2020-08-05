// Originally written by Chris Janes

#pragma strict

public var viewAngle:float;
public var viewDistance:float;
public var target:Transform;

@Range(0.01, 10)
public var speed:float;
public var rotationSpeed:float;

public var spriteRenderer:SpriteRenderer;

public function canSee():boolean
{
	var direction:Vector2 = (target.position - transform.position).normalized;
	var distance:float = Vector2.Distance(target.position, transform.position);
	var angle:float = Vector2.Angle(direction, transform.up);
	if ( angle < viewAngle / 2f)
	{
		if ( distance < viewDistance )
		{
			return true;
		}
	}

	return false;
}

function Update () {
	if ( canSee() )
	{
		spriteRenderer.color = Color.red;
		transform.position = Vector2.MoveTowards(transform.position, target.position, speed * Time.deltaTime);
		var direction:Vector2 = (target.position - transform.position).normalized;
		transform.rotation = Quaternion.Slerp ( transform.rotation, 
                    Quaternion.FromToRotation (Vector2.up, direction), 
                    rotationSpeed * Time.deltaTime);

	} else {
		spriteRenderer.color = Color.white;
	}
}