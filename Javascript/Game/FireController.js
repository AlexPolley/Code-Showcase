#pragma strict

public var bulletPrefab:GameObject;
public var canFire:boolean = true;
public var fireRate:float;
public var firePoint:Transform;
public var bulletPool:GameObject[];
public var bulletMax:int = 10;

function Start () {
	// build the bullet pool
	
	// assign memory to the array
	bulletPool = new GameObject[bulletMax];
	
	// loop through the array and instantiate bullet objects for each slot
	for ( var i:int = 0; i < bulletMax; i++) 
	{
		bulletPool[i] = Instantiate(bulletPrefab, firePoint.position, transform.rotation);
		bulletPool[i].SetActive(false);
	}
}

// firebullet function with no arguments.
public function FireBullet()
{
	// call the firebullet function passing the current transform rotation as an argument.
	FireBullet(transform.rotation);
}

// override the blank firebullet function and take a rotation
public function FireBullet(newRotation:Quaternion)
{
	// can we fire?
	if ( canFire )
	{
		// if so, loop through the bullet pool
		for ( var i:int = 0; i < bulletMax; i++) 
		{
			// and find the first inactive bullet to activate
			if ( bulletPool[i].activeSelf == false )
			{
				bulletPool[i].transform.position = firePoint.position;
				bulletPool[i].transform.rotation = newRotation;
				bulletPool[i].SetActive(true);
				break;
			}
		}
		
		// reset our ability to fire
		canFire = false;
		
		// and start checking to see when we can fire again
		FireRateCheck();
	}
}

private function FireRateCheck()
{
	// yield stops this function running
	// here, for however many seconds specified by fireRate
	yield WaitForSeconds(fireRate);
	
	// once that time is up, reset canFire to true.
	canFire = true;
}